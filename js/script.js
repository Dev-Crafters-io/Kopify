const dateElement = document.querySelector('.datetime strong');
const timeElement = document.querySelector('.datetime span');

function updateDateTime() {
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'short'
    });
    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    dateElement.textContent = dateFormatter.format(now).replace('.', '');
    timeElement.textContent = timeFormatter.format(now).replace(':', '.');
}
updateDateTime();
setInterval(updateDateTime, 1000);