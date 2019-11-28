let timerFunction;

var picPuzzle = {
    stepCount: 0,
    startTime: new Date().getTime(),
    score: function () {

        return 100000 - (picPuzzle.stepCount * Math.ceil((1000 + Math.random()*1000)));

    },
    startGame: function(pictures, gridSize) {
        this.setPicture(pictures, gridSize);
        helper.doc("playPanel").style.display = "block";

        let vals;
        do {
            helper.shuffle("sortable");
            vals = Array.from(helper.doc("sortable").children).map(
                x => x.id
            );
        } while (isSorted(vals));
        this.stepCount = 0;
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function() {
        var now = new Date().getTime();
        let elapsedTime = parseInt(((now - picPuzzle.startTime) / 1000, 10));
        helper.doc("timerPanel").textContent = elapsedTime;
        timerFunction = setTimeout(picPuzzle.tick, 1000);
    },
    sound: function(n) {
        if(n ==1){
            var audio = new Audio('/game1/audio/drop.mp3');
        } else if (n==2){
            var audio = new Audio('/game1/audio/Ta Da.mp3');
        }
        audio.play();
    },
    setPicture: function(pictures, gridSize = 4) {
        var percentage = 100 / (gridSize - 1);
        var picture = pictures[Math.floor(Math.random() * pictures.length)];
        helper.doc("picTitle").innerHTML = picture.title;
        helper.doc("actualPicture").setAttribute("src", picture.src);
        helper.doc("sortable").innerHTML = "";
        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = percentage * (i % gridSize) + "%";
            var ypos = percentage * Math.floor(i / gridSize) + "%";

            let li = document.createElement("li");
            li.id = i;
            li.setAttribute("data-value", i);
            li.style.backgroundImage = "url(" + picture.src + ")";
            li.style.backgroundSize = gridSize * 100 + "%";
            li.style.backgroundPosition = xpos + " " + ypos;
            li.style.width = 600 / gridSize + "px";
            li.style.height = 600 / gridSize + "px";




            li.setAttribute("draggable", "true");
            li.ondragstart = event =>
                event.dataTransfer.setData("data", event.target.id);
            li.ondragover = event => event.preventDefault();
            li.ondrop = event => {
               picPuzzle.sound(1);
                var origin = helper.doc(event.dataTransfer.getData("data"));
                var dest = helper.doc(event.target.id);
                var p = dest.parentNode;

                if (origin && dest && p) {
                    let children = p.children;
                    let after = [];
                    for (let i = 0; i < children.length; i++) {
                        let e = children.item(i);
                        if (e == dest) after.push(origin);
                        else if (e == origin) after.push(dest);
                        else after.push(e);
                    }

                    after.forEach(e => p.appendChild(e));

                    let vals = Array.from(helper.doc("sortable").children).map(
                        x => x.id
                    );
                    const now = new Date().getTime();
                    helper.doc("stepCount").textContent = ++picPuzzle.stepCount;
                    document.querySelector(".timeCount").textContent = parseInt(
                        (now - picPuzzle.startTime) / 1000,
                        10
                    );

                    if (isSorted(vals)) {
                        picPuzzle.sound(2);
                        helper.doc("actualPictureBox").innerHTML = helper.doc(
                            "done"
                        ).innerHTML;
                        helper.doc("stepCount").textContent =
                            picPuzzle.stepCount;
                        helper.doc("score").textContent = picPuzzle.score();
                    }
                }
            };
            li.setAttribute("dragstart", "true");
            helper.doc("sortable").appendChild(li);
        }

        helper.shuffle("sortable");
    }
};

isSorted = arr =>
    arr.every((elem, index) => {
        return elem == index;
    });

var helper = {
    doc: id => document.getElementById(id) || document.createElement("div"),

    shuffle: id => {

        var ul = document.getElementById(id);
        for (var i = ul.children.length ; i > 0; i--) {
            ul.appendChild(ul.children[(Math.random() * i) | 0]);
        }
    }
};
