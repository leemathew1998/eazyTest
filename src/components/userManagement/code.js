self.onmessage = function (event) {
  var data = event.data;

  var num = 0;

  for (var i = 0; i < data; i++) {
    num += i;
  }

  self.postMessage(num);
};
