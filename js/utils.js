const dataset = {
  //url: 'http://react-cdp-api.herokuapp.com/movies?search=&searchBy=title&sortBy=title&sortOrder=asc',
  url: 'http://my-json-server.typicode.com/alexander-lyakhov/coverflow/images',
  page: 1, limit: 10,
  load() {
    return fetch(this.url + `?_page=${this.page}&_limit=${this.limit}`)
      .then(res => res.json())
      .then(res => {
        res[0] && this.page++;
        return res;
      })
  }
}

class Progressbar {
  constructor(params = {}) {
    this.el = document.querySelector(params.el || '.progressbar');
  }

  set value(val) {
    this.el.children[0].style.width = `${val}%`;
  }
}

class Landing {
  constructor() {
    this.landing = document.createElement('div');
    this.landing.className = 'landing';

    this.overlay = document.createElement('div');
    this.overlay.className = 'landing__overlay';

    this.img = document.createElement('img');

    this.landing.appendChild(this.overlay);
    this.landing.appendChild(this.img);

    this.bindEvents();
  }

  bindEvents() {
    this.onKeyDown = this.keyDownHandler;
  }

  keyDownHandler(resolve, e) {
    if (e.code === 'Escape') {
      this.hide();

      window.removeEventListener('keydown', this.onKeyDown);
      delete this.onKeyDown;

      resolve();
    }
  }

  show(src = '') {
    this.img.src = src;
    document.body.appendChild(this.landing);
    return this.onShow();
  }

  onShow() {
    return new Promise(resolve => {
      this.onKeyDown = this.keyDownHandler.bind(this, resolve);
      window.addEventListener('keydown', this.onKeyDown);
    })
  }

  hide() {
    document.body.removeChild(this.landing);
  }
}