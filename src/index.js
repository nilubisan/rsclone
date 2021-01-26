import "./styles/reg-styles.scss";
import "./styles/workspace-styles.scss";
import Registration from "./reg.js"
import Workspace from "./workspace.js";

const app = document.querySelector("#app");
if(!localStorage.getItem("isRegUser")) {
    let reg = new Registration(app);
} else {
    let wS = new Workspace(app);
}