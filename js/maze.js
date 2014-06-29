var maze = {};

// up, right, down, left
maze.D = [[-1, 0], [0, 1], [1, 0], [0, -1]];

maze.generator = {};

maze.generator.dfs = (function(){
  var W_, H_;
  var m_, p_;
  var d_ = maze.D;
  var s_;
  var maze_;

  function init() {
    var i, j;

    maze_ = new Array(H_);
    for (i = 0; i < H_; ++i)
      maze_[i] = new Array(W_);

    for (i = 0; i < H_; ++i)
      for (j = 0; j < W_; ++j)
        maze_[i][j] = [0, 0, 0, 0];

    // init maze array
    m_ = new Array(H_ + 2);
    for (i = 0; i < H_ + 2; ++i)
      m_[i] = new Array(W_ + 2);

    for (i = 0; i < W_ + 2; ++i)
      m_[0][i] = m_[H_ + 1][i] = true;

    for (i = 1; i <= H_; ++i) {
      m_[i][0] = m_[i][W_ + 1] = true;
      for (j = 1; j <= W_; ++j)
        m_[i][j] = false;
    }

    // init probability
    p_ = {};

    var k, t, s;
    var tmp = [0, 0, 0, 0];

    for (i = 0; i < 4; ++i)
      while(!(tmp[i] = Math.random()));

    for (i = 0; i < 16; ++i) {
      k = ("000" + i.toString(2)).slice(-4);

      p_[k] = [0, 0, 0, 0];
      s = 0;
      for (j = 0; j < 4; ++j)
        if ("1" === k[j])
          s += (p_[k][j] = tmp[j]);

      t = 0;
      for (j = 0; j < 4; ++j) {
        if ("1" === k[j]) {
          t = (p_[k][j] = p_[k][j] / s + t);
          if (Math.abs(t - 1) < 1e-6) {
            p_[k][j] = 1;
            break;
          }
        }
      }
    }
  }

  function randomNext(rc) {
    var i, k, ind;
    var prob, cell = m_[rc[0]][rc[1]];

    ind = "";
    for (i = 0; i < 4; ++i)
      ind += m_[rc[0] + d_[i][0]][rc[1] + d_[i][1]] ? "0" : "1";
    prob = p_[ind];

    while (Math.abs(k = Math.random()) < 1e-6);
    for (i = 0; i < 4; ++i) {
      if (k <= prob[i]) {
        maze_[rc[0] - 1][rc[1] - 1][i] = 1;
        return [rc[0] + d_[i][0], rc[1] + d_[i][1]];
      }
    }

    return rc;
  }

  function ret(w, h, x, y) {
    W_ = w;
    H_ = h;

    init();

    x = x || 1;
    y = y || 1;

    m_[x][y] = true;
    s_ = [[y, x]];

    return ret;
  }

  ret.next = function() {
    var c = s_[s_.length - 1];
    var n = randomNext(c);

    if (n[0] == c[0] && n[1] == c[1]) {
      s_.pop();
      if (s_.length > 0)
        n = s_[s_.length - 1];

      return {
        forward: false,
        current: c,
        next: n
      };
    } else {
      s_.push(n);
      m_[n[0]][n[1]] = true;

      return {
        forward: true,
        current: c,
        next: n
      };
    }
  };

  ret.end = function() {
    return s_.length == 0;
  };

  ret.maze = function() {
    return maze_;
  };

  return ret;

})();
