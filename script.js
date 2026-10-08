const ESP32_IP = "192.168.1.100";


async function command(path) {

    try {

        const response = await fetch(
            "http://" + ESP32_IP + path,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("ESP32 error");
        }

        console.log(await response.text());

        updateStatus();

    } catch (error) {

        console.log(error);

        document.getElementById("connection").textContent =
            "ESP32 DISCONNECTED";

        document.getElementById("connection").className =
            "status offline";
    }
}


function ringAll() {
    command("/bell");
}


function stopAll() {
    command("/stop");
}


function ringBell(number) {
    command("/bell" + number);
}


function earthquakeTest() {

    if (confirm("Start earthquake alarm test?")) {
        command("/earthquake");
    }
}


function fireTest() {

    if (confirm("Start fire alarm test?")) {
        command("/fire");
    }
}


function stopAlarm() {
    command("/stopalarm");
}


async function updateStatus() {

    try {

        const response = await fetch(
            "http://" +
            ESP32_IP +
            "/status?t=" +
            Date.now(),
            {
                cache: "no-store"
            }
        );

        const data = await response.json();


        document.getElementById("connection").textContent =
            "ESP32 CONNECTED";

        document.getElementById("connection").className =
            "status online";


        document.getElementById("systemStatus").textContent =
            data.status;


        document.getElementById("currentSubject").textContent =
            data.subject;


        document.getElementById("remaining").textContent =
            data.remaining;


        const subjects =
            document.querySelectorAll(".subject");


        subjects.forEach((subject, index) => {

            subject.classList.toggle(
                "active",
                index === data.current
            );

        });

    } catch (error) {

        document.getElementById("connection").textContent =
            "ESP32 DISCONNECTED";

        document.getElementById("connection").className =
            "status offline";
    }
}


setInterval(updateStatus, 1000);

updateStatus();
