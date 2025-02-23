export function kmHrSpeedCalculator(time: string, distance: number) {
    let nbSecSec = parseInt(time.substr(6, 2));
    let nbSecMin = parseInt(time.substr(3, 2)) * 60;
    let nbSecHr = parseInt(time.substr(0, 2)) * 3600;
    let totalSec = nbSecSec + nbSecMin + nbSecHr;
    let kmHr = (distance * 3600) / totalSec;
    return kmHr
}

export function minKmSpeedCalculator(time: string, distance: number) {
    let nbSecSec = parseInt(time.substr(6, 2));
    let nbSecMin = parseInt(time.substr(3, 2)) * 60;
    let nbSecHr = parseInt(time.substr(0, 2)) * 3600;
    let totalSec = nbSecSec + nbSecMin + nbSecHr;
    let secKm = Math.floor(totalSec / distance);
    let minKm = Math.floor(secKm / 60);
    let resteSec = secKm % 60;
    return parseFloat(minKm + '.' + resteSec);
}