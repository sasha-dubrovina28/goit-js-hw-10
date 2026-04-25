import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", event => {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const shouldResolve = form.elements.state.value === "fulfilled";

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  })
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: "topRight",
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        position: "topRight",
      });
    });

  form.reset();
});