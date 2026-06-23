const timezone = Intl.supportedValuesOf('timeZone');
const originSelect = document.getElementById('origin');
const destSelect = document.getElementById('destination');


timezone.forEach((tz) => {
    originSelect.appendChild(new Option(tz, tz));
    destSelect.appendChild(new Option(tz, tz));
});

originSelect.value = 'America/New_York';
destSelect.value = 'Europe/London';


function calculateOffset() {
    const originStr = originSelect.value;
    const destStr = destSelect.value;
    const now = new Date();

    const getOffsetHours = (tz) => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).formatToParts(now);

        const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
        const tzTime = Date.UTC(
            Number(values.year),
            Number(values.month) - 1,
            Number(values.day),
            Number(values.hour),
            Number(values.minute),
            Number(values.second)
        );

        return (tzTime - now.getTime()) / 1000 / 60 / 60;
    };

    const originOffset = getOffsetHours(originStr);
    const destOffset = getOffsetHours(destStr);
    const diffHours = destOffset - originOffset;

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';


    let explanation = '';
    if (diffHours > 0) {
        explanation = `You are traveling ${diffHours} hours <strong>East</strong> (Losing time).`;
    } else if (diffHours < 0) {
        explanation = `You are traveling ${Math.abs(diffHours)} hours <strong>West</strong> (Gaining time).`;
    } else {
        explanation = `Both timezones are in the same offset.`;
    }

    resultDiv.innerHTML = `
        <h3>Result: Shift of ${diffHours} hours</h3>
        <p>${explanation}</p>
        <small>Origin Offset: UTC${originOffset >= 0 ? '+' : ''}${originOffset}</small><br>
        <small>Destination Offset: UTC${destOffset >= 0 ? '+' : ''}${destOffset}</small>
    `;
}
