function clearErrorNotification() {
    fetch('/clear-error-notification/')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'cleared') {
                alert('Session cleared!');
            }
        });
}

function clearQuestionIds() {
    fetch('/clear-question-ids/')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'cleared') {
                alert('Session cleared!');
            }
        });
}