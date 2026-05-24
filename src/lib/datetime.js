export function backendToDatetimeLocal(value) {
    if (!value) return "";

    // Backend sempre manda: "DD/MM/YYYY HH:mm"
    const m = String(value).match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/
    );
    if (!m) return "";

    const [, dd, mm, yyyy, hh, min] = m;
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function datetimeLocalToBackend(value) {
    if (!value) return undefined;

    // datetime-local: "YYYY-MM-DDTHH:mm"
    const m = String(value).match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
    );
    if (!m) return undefined;

    const [, yyyy, mm, dd, hh, min] = m;
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
