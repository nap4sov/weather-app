class Clock {
    deg = 6;
    hr = document.querySelector('#hr');
    mn = document.querySelector('#mn');
    sc = document.querySelector('#sc');

    run = () => {
        setInterval(() => {
            let day = new Date();
            let hh = day.getHours() * 30;
            let mm = day.getMinutes() * this.deg;
            let ss = day.getSeconds() * this.deg;
            let msec = day.getMilliseconds();

            // VERY IMPORTANT STEP:

            this.hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
            this.mn.style.transform = `rotateZ(${mm}deg)`;
            this.sc.style.transform = `rotateZ(${ss}deg)`;

            // gives the smooth transitioning effect, but there's a bug here!
            // sc.style.transition = `1s`;
        }, 1000);
    };
}

export default Clock;
// const deg = 6;
// // 360 / (12 * 5);

// const hr = document.querySelector('#hr');
// const mn = document.querySelector('#mn');
// const sc = document.querySelector('#sc');

// setInterval(() => {
//     let day = new Date();
//     let hh = day.getHours() * 30;
//     let mm = day.getMinutes() * deg;
//     let ss = day.getSeconds() * deg;
//     let msec = day.getMilliseconds();

//     // VERY IMPORTANT STEP:

//     hr.style.transform = `rotateZ(${hh + mm / 12}deg)`;
//     mn.style.transform = `rotateZ(${mm}deg)`;
//     sc.style.transform = `rotateZ(${ss}deg)`;

//     // gives the smooth transitioning effect, but there's a bug here!
//     // sc.style.transition = `1s`;
// });
