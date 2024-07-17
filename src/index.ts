import consola from 'consola';
import inquirer from 'inquirer';

// Enum dla wariantów wiadomości
enum MessageType {
  Success = 'success',
  Error = 'error',
  Info = 'info'
}

// Klasa Message
class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show(): void {
    console.log(this.content);
  }

  public capitalize(): void {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  public static showColorized(type: MessageType, text: string): void {
    switch (type) {
      case MessageType.Success:
        consola.success(text);
        break;
      case MessageType.Error:
        consola.error(text);
        break;
      case MessageType.Info:
        consola.info(text);
        break;
      default:
        consola.log(text);
    }
  }
}

interface User {
  name: string;
  age: number;
}

// Klasa UsersData
class UsersData {
  private data: User[] = [];

  public showAll(): void {
    Message.showColorized(MessageType.Info, 'Users data');

    if (this.data.length === 0) {
      console.log('No data...');
    } else {
      console.table(this.data);
    }
  }

  public add(user: User): void {
    const { name, age } = user;

    if (typeof name === 'string' && name.length > 0 && typeof age === 'number' && age > 0) {
      this.data.push(user);
      Message.showColorized(MessageType.Success, 'User has been successfully added!');
    } else {
      Message.showColorized(MessageType.Error, 'Wrong data!');
    }
  }

  public remove(name: string): void {
    const initialLength = this.data.length;
    this.data = this.data.filter(user => user.name !== name);

    if (this.data.length < initialLength) {
      Message.showColorized(MessageType.Success, 'User deleted!');
    } else {
      Message.showColorized(MessageType.Error, 'User not found...');
    }
  }
}

// Define the available actions
enum Action {
  List = 'list',
  Add = 'add',
  Remove = 'remove',
  Quit = 'quit'
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageType.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: { action: Action }) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(MessageType.Info, "Bye bye!");
        return;
    }

    startApp();
  });
}

startApp();
