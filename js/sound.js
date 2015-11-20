var SN_SOUND_INIT = false;

$(document).ready(function() {
  ion.sound({
    sounds: [
      {
        alias: "other_moved",
        name: "button_tiny",
      },
      {
        alias: "local_moved",
        name: "snap",
      },
      {
        alias: "game_over",
        name: "computer_error",
        //volume: 0.2,
      },
      {
        alias: "win",
        name: "bell_ring",
        volume: 0.2,
      },
      {
        alias: "fail",
        name: "light_bulb_breaking",
        volume: 0.05,
      },
    ],
    path: "sounds/",
    multiplay: true,
    preload: true,
    volume: 1.0
  });

  SN_SOUND_INIT = true;
});

function sn_sound_play(sound) {
// && SN_SOUND_ENABLED
  SN_SOUND_INIT ? ion.sound.play(sound) : false;
}
