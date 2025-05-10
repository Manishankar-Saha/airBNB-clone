document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the class 'alert'
  const alertElements = document.querySelectorAll(".alert");

  // Define the time in milliseconds after which the alert should be removed (e.g., 5000ms = 5 seconds)
  const autoCloseTime = 2000; // Adjust this value as needed

  alertElements.forEach(function (alertElement) {
    // Use setTimeout to remove the alert after the specified time
    setTimeout(function () {
      // Use Bootstrap's JavaScript API to close the alert with a fade effect
      const bootstrapAlert = bootstrap.Alert.getInstance(alertElement);
      if (bootstrapAlert) {
        bootstrapAlert.close();
      } else {
        // If Bootstrap's JS is not available or the instance isn't found,
        // just remove the element directly
        alertElement.remove();
      }
    }, autoCloseTime);
  });
});
