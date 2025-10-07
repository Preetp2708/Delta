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
