import { KeyboardHandler } from "../../handlers/KeyboardHandler";

export class OnlineInputSystem {
    execute(serverConnection) {
        if (KeyboardHandler.isHold("ArrowUp")) {
            serverConnection.sendAction({
                direction: "up",
            });
        }
        if (KeyboardHandler.isHold("ArrowDown")) {
            serverConnection.sendAction({
                direction: "down",
            });
        }
    }
}
