"use strict";

let doc = document;

// pleer container
let pleer = doc.createElement('div');
pleer.setAttribute('id', 'pleer');

// track name
let track_name = doc.createElement('div');
track_name.setAttribute('class', 'pleer__track_name');

// buttons row
let buttons_row = doc.createElement('div');
buttons_row.setAttribute('class', 'pleer__buttons_row');

// play/pause button
let play = doc.createElement('button');
play.setAttribute('class', 'pleer__play');
let play_icon = doc.createElement('i');
play_icon.setAttribute('class','pleer__play_icon fa fa-play');
play_icon.setAttribute('aria-hidden', 'true');
play.append(play_icon);
let pause_icon = doc.createElement('i');
pause_icon.setAttribute('class','pleer__pause_icon fa fa-pause');
pause_icon.setAttribute('aria-hidden', 'true');
let play_pause = false;

// start timer
let start_time = doc.createElement('output');
start_time.setAttribute('class', 'pleer__start_time');
start_time.insertAdjacentHTML('afterbegin', '00:00');

// remain timer
let end_time = doc.createElement('output');
end_time.setAttribute('class', 'pleer__end_time');
end_time.insertAdjacentHTML('afterbegin', '00:00');

// timeline
let timeline = doc.createElement('input');
timeline.setAttribute('type', 'range');
timeline.setAttribute('class', 'pleer__timeline');
timeline.setAttribute('min', '0');
timeline.setAttribute('value', '0');

// track 
let track = new Audio();
let duration = track.duration;

// play speed
let speed = doc.createElement('select');
speed.setAttribute('class', 'pleer__speed');
speed.insertAdjacentHTML('afterbegin', '<option value="0.5">0.5x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="1.75">1.75x</option><option value="2">2x</option><option value="2.5">2.5x</option>')

// volume
let volume_button = doc.createElement('button');
volume_button.setAttribute('class', 'pleer__volume_button');
let volume_icon = doc.createElement('i');
volume_icon.setAttribute('class','pleer__volume_icon fa fa-volume-up');
volume_icon.setAttribute('aria-hidden', 'true');
let middle_volume_icon = doc.createElement('i');
middle_volume_icon.setAttribute('class','pleer__middle_volume_icon fa fa-volume-down');
middle_volume_icon.setAttribute('aria-hidden', 'true');
let mute_icon = doc.createElement('i');
mute_icon.setAttribute('class','pleer__mute_icon fa fa-volume-off');
mute_icon.setAttribute('aria-hidden', 'true');
let volume_container = doc.createElement('div');
volume_container.setAttribute('class', 'pleer__volume_container');
let volume = doc.createElement('input');
volume.setAttribute('class', 'pleer__volume');
volume.setAttribute('type', 'range');
volume.setAttribute('min', '0');
volume.setAttribute('max', '100');
volume.setAttribute('value', '100');
volume_container.append(volume);
volume_button.append(volume_icon);

// download button
let download_button = doc.createElement('button');
download_button.setAttribute('class', 'pleer__download_button');
let download_icon = doc.createElement('i');
download_icon.setAttribute('class','pleer__download_icon fa fa-download');
download_icon.setAttribute('aria-hidden', 'true');
download_button.append(download_icon);

// upload button
let upload_button = doc.createElement('button');
upload_button.setAttribute('class', 'pleer__upload_button');
let upload_icon = doc.createElement('i');
upload_icon.setAttribute('class','pleer__upload_icon fa fa-upload');
upload_icon.setAttribute('aria-hidden', 'true');
upload_button.append(upload_icon);

buttons_row.append(play, start_time, timeline, end_time, speed, volume_button, volume_container, download_button, upload_button);
pleer.append(track_name, buttons_row);

// time calc func
function timeCalc(time) { 
	time = Math.floor(time);
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time - minutes * 60);
	let minutesVal = minutes;
	let secondsVal = seconds;
	if(minutes < 10) {
		minutesVal = '0' + minutes;
	}
	if(seconds < 10) {
		secondsVal = '0' + seconds;
	}
	return minutesVal + ':' + secondsVal;
}

// volume change func
function changeVolume() { 
	let volume = doc.querySelector('.pleer__volume').value / 100;
	track.volume = volume;
}

// speed change func
function changeSpeed() { 
	let speed = doc.querySelector('.pleer__speed').value;
	track.playbackRate = speed;
}

// play/pause func
function play_pause_func() {
	play_pause = !play_pause;
	if (play_pause) {
		doc.querySelector('.pleer__play').innerHTML = '';
		doc.querySelector('.pleer__play').append(pause_icon);
		track.play();
	} else {
		doc.querySelector('.pleer__play').innerHTML = '';
		doc.querySelector('.pleer__play').append(play_icon);
		track.pause();
	}
}

// download func
function download_func() {
	fetch(track.src)
        .then(response => response.blob())
        .then(blob => {
            let url = URL.createObjectURL(blob);
            let a = doc.createElement('a');
            a.href = url;
            a.download = `${doc.querySelector('.pleer__track_name').innerHTML}.xlsx`;
            doc.body.appendChild(a);  
            a.click();    
            a.remove();        
        })
        .catch(error => alert(error));
}

// upload func
function upload_func() {
	let formData = new FormData();
	let fileInput = doc.createElement('input');
	fileInput.setAttribute('type', 'file');
	doc.body.appendChild(fileInput);
	fileInput.click();
	formData.append('file', fileInput.files[0]);
	
	/*const options = {
  		method: 'POST',
  		body: formData,
	};

	fetch('upload-url', options)
		.catch(error => alert(error));*/

	fileInput.remove();
}

// add pleer on page
doc.addEventListener('click', (event) => {
	if (event.target.className == 'play_music') {
		track.src = event.target.dataset.href;
		track_name.innerHTML = event.target.dataset.name;
		doc.body.append(pleer);
		

		play_pause = false;
		doc.querySelector('.pleer__play').innerHTML = '';
		doc.querySelector('.pleer__play').append(play_icon);

		// play/pause event
		doc.querySelector('.pleer__play').onclick = play_pause_func;

		// volume event
		doc.querySelector('.pleer__volume_button').onfocus = function() {
			doc.querySelector('.pleer__volume_container').style.display = 'block';
			doc.querySelector('.pleer__volume').focus();
		};

		doc.querySelector('.pleer__volume').onblur = function() {
			doc.querySelector('.pleer__volume_container').style.display = 'none';
		};

		doc.querySelector('.pleer__volume').onchange = function() {
			if (doc.querySelector('.pleer__volume').value < 10) {
				doc.querySelector('.pleer__volume_button').innerHTML = '';
				doc.querySelector('.pleer__volume_button').append(mute_icon);
			} else if ((doc.querySelector('.pleer__volume').value >= 10) && (doc.querySelector('.pleer__volume').value < 60)) {
				doc.querySelector('.pleer__volume_button').innerHTML = '';
				doc.querySelector('.pleer__volume_button').append(middle_volume_icon);
			} else {
				doc.querySelector('.pleer__volume_button').innerHTML = '';
				doc.querySelector('.pleer__volume_button').append(volume_icon);
			}
			changeVolume();
		};

		// timeline event
		doc.querySelector('.pleer__timeline').onchange = function() {
			track.currentTime = this.value;
			doc.querySelector('.pleer__timeline').setAttribute("max", track.duration);
		};

		// timeupdate event
		track.addEventListener('timeupdate', function() {
			let currentTime = parseInt(track.currentTime, 10);
			doc.querySelector('.pleer__timeline').value = currentTime;
			doc.querySelector('.pleer__start_time').value = timeCalc(currentTime);
			doc.querySelector('.pleer__end_time').value = timeCalc(!isNaN(track.duration) ? track.duration - currentTime : 0);
		});

		// speed event
		doc.querySelector('.pleer__speed').onchange = changeSpeed;

		// download event
		doc.querySelector('.pleer__download_button').onclick = download_func;

		// upload event
		doc.querySelector('.pleer__upload_button').onclick = upload_func;
	}  
});
