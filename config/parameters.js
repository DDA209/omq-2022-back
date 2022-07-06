const emailLength = { min: 5, max: 256 };
const passwordLength = { min: 8, max: 128 };
const emailRegex = /^[^@\s]+@[^@.\s]+\.[^@.\s]+$/;
const passwordRegexHigh = new RegExp(
	`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!*^?](?=.*[\\&\\"\\'\\(\\_\\)\\#\\{\\[\\|\\@\\]\\}\\°\\/\\*\\-\\+\\,\\?\\;\\.\\:\\/\\!\\§\\%\\$\\£\\\\]).{${passwordLength.min},${passwordLength.max}}$`
); // MAJ + min + Num + special character, length = passwordLength.min
const secretVeryHigh =
	'r"€M(7u¤è4q;qGOÙj3thìè IÑüä?>D4R=KùWrl*§ù=<Va3];EFodB¤=M%Ö+.v°QC¤A€[àLB²€4éÀ*Gnÿ30?c"µàQvcfI)ÏM2 ïKnL?ù23w&]Oùc5Ïù1O>iÑÖ?ÿ}KP#@';
const secretHigh =
	'C6eOPgqs4NAJkK4sDT8DfplYVIK16gHTGmjMzvnQzHykOINePVSh1BhZVJJNT1Al';
const secretLow = '2DIX10YRXJ94CYGH';
const tokenExpirationDuration = '2h'; // just a number : delay in secondes (or '2h' '30d'...)
// const tokenExpirationDuration = 90; // delay for tests

module.exports = {
	emailLength,
	passwordLength,
	emailRegex,
	passwordRegexHigh,
	secretVeryHigh,
	secretHigh,
	secretLow,
	tokenExpirationDuration,
};
