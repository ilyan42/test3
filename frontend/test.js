import { changeView } from "./camera.js";

document.querySelectorAll("button[data-view]").forEach(button => {
	button.addEventListener("click", function () {
		const viewName = this.getAttribute("data-view");
		changeView(viewName);
	});
});

