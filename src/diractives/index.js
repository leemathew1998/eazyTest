import checkRole from "./checkRole.js";
const setupDirectives = (app) => {
    app.directive("checkRole", checkRole);
};
export default setupDirectives;