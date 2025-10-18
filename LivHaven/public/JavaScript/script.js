// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  // -------------------------------
  // Card click navigation
  // -------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.listing-card')

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id
        window.location.href = `/listing/${id}`
      })
    })
  })
})()

document.addEventListener("DOMContentLoaded", () => {
  const navBtn = document.getElementById("nav-btn");
  if (!navBtn) return;

  if (navBtn.classList.contains("btn-success") || navBtn.classList.contains("btn-danger")) {
    setTimeout(() => {
      navBtn.className = "btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm";
      navBtn.textContent = "Welcome to LivHaven!";
    }, 4000);
  }
});
