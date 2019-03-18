//Assume that fps is about 30fps or better

const tweensPerSecond = 10;
var runningTweens = {};

function tween(targets, updater, seconds, name) {

    var runningTween = {
        name: name,
        targets: listify(targets),
        seconds: seconds,
        update: updater,
        start: Date.now(),
        end: Date.now() + seconds * 1000
    };

    runningTweens[name] = runningTween;

    runningTween.intervalID = setInterval(tweenUpdate.bind(runningTween), 1000 / tweensPerSecond);   
}

function tweenUpdate() {

    var target, removeTarget;
    let now = Date.now();
    let progress = (now - this.start) / (this.seconds * 1000) * 100;
    progress = Math.min(progress, 100);

    for (target of this.targets) {
        removeTarget = this.update(target, progress);
        if (removeTarget)
            this.targets.remove(target);
    }

    if (progress >= 100 ){
        clearInterval(this.intervalID);
    }
}

var tweens = {};

tweens.fadeIn = function fadeIn(target, progress) {
    target.style.opacity = 0.01 * progress;
};
