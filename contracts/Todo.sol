// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

error Todo__NotOwner();
error Todo__InitialPaymentNeeded();

contract Todo {
  uint256 public constant MINIMUM_USD = 1 * 1e18;
  uint256 private taskId = 0;
  address private immutable i_Owner;

  struct Users {
    string fullname;
    address id;
  }
  Users[] private users;

  enum Status {
    ToDo,
    Doing,
    Done
  }

  struct Task {
    string title;
    string description;
    Status status;
    uint256 id;
  }

  mapping(string => address) userToId;
  mapping(uint256 => Task) idToTask;

  event Payed(string fullName);
  event TaskCreated(uint256 id, string title);
  event TaskUpdated(uint256 id);

  modifier owner() {
    if (msg.sender != i_Owner) {
      revert Todo__NotOwner();
    }
    _;
  }

  constructor() {
    i_Owner = msg.sender;
  }

  function initialPayment(string memory _fullName) public payable {
    require(msg.value >= MINIMUM_USD, "Not enough ETH.");
    users.push(Users(_fullName, msg.sender));
    userToId[_fullName] = msg.sender;
    emit Payed(_fullName);
  }

  function createTask(
    string memory _fullName,
    string memory _title,
    string memory _description,
    Status _status
  ) public owner {
    if (userToId[_fullName] != msg.sender) {
      revert Todo__InitialPaymentNeeded();
    }
    taskId++;
    idToTask[taskId] = Task(_title, _description, _status, taskId);
    emit TaskCreated(taskId, _title);
  }

  function updateTask(Status _status, uint256 _id) public owner {
    Task memory _task = idToTask[_id];
    _task.status = _status;
    idToTask[_id] = _task;
    emit TaskUpdated(_id);
  }

  function getTask(uint256 _taskId) public view owner returns (Task memory) {
    return idToTask[_taskId];
  }

  function getAllTasks() public view owner returns (Task[] memory) {
    Task[] memory tasks = new Task[](taskId);
    for (uint256 index = 1; index <= taskId; index++) {
      tasks[index - 1] = idToTask[index];
    }
    return tasks;
  }
}
