
const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16);

const macGenerate = () => {
    return "XX-XX-XX-XX-XX-XX".replace(/X/g, function () {
        return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
    });
}

const ipGenerate = () => {
    return (Math.floor(Math.random() * 255) + 1) + "." +
        (Math.floor(Math.random() * 255) + 1) + "." +
        (Math.floor(Math.random() * 255) + 1) + "." +
        (Math.floor(Math.random() * 255) + 1);
}

export { randomColor, macGenerate, ipGenerate }