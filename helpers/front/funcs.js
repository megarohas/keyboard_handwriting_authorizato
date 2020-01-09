export function collectKeyboardActions({ phrase, keyboard_actions }) {
  let result_actions = [];
  // let phrase = this.state.phrase;
  // let keyboard_actions = [...this.state.keyboard_actions];
  // type: "key_down"
  // timestamp: 1578373827552
  // key: "k"
  let typing_time = 0;
  let shift_flag = 0;
  let caps_flag = 0;
  let result = [];
  let default_action = {
    type: "default",
    timestamp: 0,
    key: "default"
  };

  do {
    let first_symbol = phrase[0];
    let keyboard_action_up = {};
    let keyboard_action_down = {};
    let keyboard_action = {};
    for (let i = 0; i < keyboard_actions.length; i++) {
      if (keyboard_actions[i].key === "Shift") shift_flag = 1;
      if (keyboard_actions[i].key === "CapsLock") caps_flag = 1;

      if (
        JSON.stringify(keyboard_action_up) == JSON.stringify({}) &&
        (first_symbol.toLowerCase() == keyboard_actions[i].key.toLowerCase() &&
          keyboard_actions[i].type == "key_up")
      ) {
        keyboard_action_up = keyboard_actions[i];
        keyboard_actions[i] = default_action;
      }
      if (
        JSON.stringify(keyboard_action_down) == JSON.stringify({}) &&
        (first_symbol.toLowerCase() == keyboard_actions[i].key.toLowerCase() &&
          keyboard_actions[i].type == "key_down")
      ) {
        keyboard_action_down = keyboard_actions[i];
        keyboard_actions[i] = default_action;
      }

      if (
        JSON.stringify(keyboard_action_down) !== JSON.stringify({}) &&
        JSON.stringify(keyboard_action_up) !== JSON.stringify({}) &&
        JSON.stringify(keyboard_action) === JSON.stringify({})
      ) {
        keyboard_action = {
          down_tmstmp: keyboard_action_down.timestamp,
          up_tmstmp: keyboard_action_up.timestamp,
          delta: Math.abs(
            (keyboard_action_up.timestamp - keyboard_action_down.timestamp) /
              1000
          ),
          key:
            keyboard_action_down.key.toLowerCase() ||
            keyboard_action_up.key.toLowerCase() ||
            "error"
        };
        result_actions.push(keyboard_action);
      }
    }

    phrase = phrase.substring(1);
  } while (phrase.length > 0);

  typing_time = Math.abs(
    (result_actions[result_actions.length - 1].up_tmstmp -
      result_actions[0].down_tmstmp) /
      1000
  );

  // let deltas = [];
  for (let i = 0; i < result_actions.length; i++) {
    if (i == 0) {
      result.push(result_actions[i].delta);
    } else {
      result.push(
        Math.abs(
          (result_actions[i].down_tmstmp - result_actions[i - 1].up_tmstmp) /
            1000
        )
      );
      result.push(result_actions[i].delta);
    }
  }

  // result = result_actions.map(item => {
  //   return item.delta;
  // });

  result.push(typing_time);

  for (let i = 0; i < result.length; i++) {
    while (Math.trunc(result[i]) != 0) {
      result[i] = result[i] / 10;
    }
  }
  result.push(shift_flag);
  result.push(caps_flag);
  console.log("result_actions", result_actions);
  console.log("typing_time", typing_time);
  console.log("result", result);

  return [...result];
}
