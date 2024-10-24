
/**
 * Function to check if the user agent is Safari.
 * @returns A boolean indicating whether the user agent is Safari.
 */
function isSafariUserAgent(): boolean {
    const userAgent = navigator.userAgent;
    return /^((?!chrome|android).)*safari/i.test(userAgent);
}


export { isSafariUserAgent }
