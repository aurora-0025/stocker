export default function StockDate({entryDate, duration}: {entryDate: string, duration: string}) {
    const today = new Date(entryDate);
    const h = ("0" + today.getHours()).slice(-2);
    const m = ("0" + today.getMinutes()).slice(-2);
    const d = today.getDate();
    const mo = today.getMonth()+1;
    const y = today.getFullYear();

    
    switch (duration) {
        case "1d":
        case "3d":
            return <>{d}/{mo} {h}:{m}</>
        default:
            return <>{d}/{mo}/{y}</>
            break;
    }
}
