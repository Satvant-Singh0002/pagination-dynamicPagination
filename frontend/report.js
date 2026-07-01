document.getElementById("reportBtn").onclick = async () => {

    document.getElementById("aiPopup").style.display = "block";
    document.getElementById("popupBody").innerHTML =
        "🤖 Generating AI Report...";

    try {

        const res = await axios.get(
            "http://localhost:4000/ai/report",
            {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            }
        );

        document.getElementById("popupBody").innerHTML = res.data.report;

    } catch (err) {

        console.log(err);

        document.getElementById("popupBody").innerHTML =
            "❌ Unable to generate report. Please try again.";

    }

};

document.getElementById("closePopup").onclick = () => {
    document.getElementById("aiPopup").style.display = "none";
};