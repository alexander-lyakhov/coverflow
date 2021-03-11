(function() {
  const coverClasses = [
    'cover-left-2',
    'cover-left-1',
    'cover-center',
    'cover-right-1',
    'cover-right-2',
  ];

  const COVER_LEFT_2 = 0;
  const COVER_LEFT_1 = 1;
  const COVER_CENTER = 2;
  const COVER_RIGHT_1 = 3;
  const COVER_RIGHT_2 = 4;

  const EVENT = {
    FIRST_COVER: 'firstCover',
    LAST_COVER: 'lastCover',
    DATA_REQUEST: 'dataRequest',
    HIT: 'hit',
    STATUS_UPDATE: 'statusUpdate',
    COVER_CHANGE: 'coverChange'
  }

  //images.length = 2;

  class Coverflow extends EventModel {
    constructor(params = {}) {
      super();

      this.params = params;

      // Selectors
      this.el = document.querySelector(params.el || '.cover-flow');
      this.coverList = this.el.querySelector('.cover-list');
      this.frame = this.el.querySelector('.cover-frame');
      this.counterCurrent  = this.el.querySelector('.cover-frame__left-bottom');
      this.counterTotal = this.el.querySelector('.cover-frame__right-bottom');
      this.arrowLeft = this.el.querySelector('.nav-arrow__left');
      this.arrowRight = this.el.querySelector('.nav-arrow__right');

      // Params properties
      this.data = params.data || [];
      this.displayField = params.displayField || null;
      this.template = params.template || `<div>{{content}}</div>`;
      this.mirrors = Boolean(params.mirrors);
      this.showStatus = params.showStatus || false;

      // Component internal properties
      this.covers = [];
      this.currentCoverIndex = 0;
      this.limit = 5;
      this.events = {};
      this.locked = false;
      this.elementAbsoluteXCenter = this.el.getBoundingClientRect().left + (this.el.offsetWidth >> 1);

      //this.bindEvents();
      this.render(COVER_CENTER); // class offset index
      console.log(this.selectedCover, this.data)
      this.bindEvents();

      this.updateStatus();
    }

    get selectedItem() {
      return this.data[this.currentCoverIndex];
    }

    get selectedCover() {
      return this.covers[COVER_CENTER];
    }

    bindEvents() {
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onClick = this.onClick.bind(this);
      //this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);

      this.bindControls();
      //this.unlock(); // bind controls
    }

    bindControls() {
      window.addEventListener('keydown', this.onKeyDown);
      //window.addEventListener('mousemove', this.onMouseMove);
      this.el.addEventListener('click', this.onClick);
      //this.el.addEventListener('mouseleave', this.onMouseLeave);
    }

    unbindControls() {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      this.el.removeEventListener('click', this.onClick);
    }

    onKeyDown(e) {
      //e.code === 'Enter' && this.triggerEvent(EVENT.HIT, this.data[this.currentCoverIndex]);
      e.code === 'Enter' && this.params.hit && this.triggerEvent(EVENT.HIT, this.data[this.currentCoverIndex]);//this.params.hit(this);
      e.code === 'ArrowLeft' && this.prev();
      e.code === 'ArrowRight' && this.next();
    }

    onClick(e) {
      console.log('click', e)

      if (e.target === this.frame) {
        this.triggerEvent(EVENT.HIT, this.data[this.currentCoverIndex]);
        return;
      }

      e.clientX < this.elementAbsoluteXCenter ? this.prev():this.next();
    }

    onMouseMove(e) {
      //console.log(e.target);

      /*
      if (e.target === this.frame) {
        this.arrowLeft.classList.add('hidden');
        this.arrowRight.classList.add('hidden');
        return;
      }

      if (e.clientX < this.elementAbsoluteXCenter) {
        if (this.mouseDirection !== -1) {
          this.mouseDirection = -1;
          this.arrowLeft.classList.remove('hidden');
          this.arrowRight.classList.add('hidden');
        }
      } else {
        if (this.mouseDirection !== 1) {
          this.mouseDirection = 1;
          this.arrowLeft.classList.add('hidden');
          this.arrowRight.classList.remove('hidden');
        }
      }
      */
    }

    onMouseLeave(e) {
      console.log('--> mouseleave', e);
    }

    createCover(index, content) {
      let cover = document.createElement('li');
        cover.className = `cover ${coverClasses[index]}`;

      let coverContent = document.createElement('div');
        coverContent.className = 'cover-content';
        coverContent.innerHTML = this.template.replace(`{{content}}`, content);

      cover.appendChild(coverContent);

      if (this.mirrors) {
        let mirror = coverContent.cloneNode(true);
          mirror.classList.add('mirror');

        let fader = document.createElement('div');
          fader.className = 'fader';

        cover.appendChild(mirror);
        cover.appendChild(fader);
      }

      return cover;
    }

    removeCover(cover) {
      cover.parentNode.removeChild(cover);
    }

    addCoverToFront(nextInsertItemIndex = 0, classOffset = 0) {
      if (this.data[nextInsertItemIndex]) {

        const coverContent = this.displayField ?
          this.data[nextInsertItemIndex][this.displayField]:
          this.data[nextInsertItemIndex];

        const cover = this.createCover(classOffset, coverContent);

        this.covers.unshift(cover);
        this.coverList.insertBefore(cover, this.coverList.children[0]);

        return 0;
      }

      // if no image was added to the left
      return 3 - this.currentCoverIndex;
    }

    addCoverToBack(nextInsertItemIndex = 0, classOffset = 4) {
      if (this.data[nextInsertItemIndex]) {

        const coverContent = this.displayField ?
          this.data[nextInsertItemIndex][this.displayField]:
          this.data[nextInsertItemIndex];

        //console.log('addCoverToBack', this.data.length, coverContent)

        const cover = this.createCover(classOffset, coverContent);

        this.covers.push(cover);
        this.coverList.appendChild(cover);

        return this.limit - this.covers.length;
      }

      // if no image was added to the right
      return 1 - this.currentCoverIndex > 0 ? 1:0;
    }

    prev() {
      if (this.currentCoverIndex > 0) {
        if (this.covers[this.covers.length - 1].classList.contains('cover-right-2')) {
          this.removeCover(this.covers[this.covers.length - 1]);
          this.covers.pop();
        }

        const res = this.addCoverToFront(this.currentCoverIndex - 3);
        this.move(res);

        this.currentCoverIndex--;
      }

      if (this.currentCoverIndex === 0) {
        this.triggerEvent(EVENT.FIRST_COVER);
      }

      this.updateStatus();
    }

    next() {
      if (this.currentCoverIndex === this.data.length - 3) {
        if (this.triggerEvent(EVENT.DATA_REQUEST)) {
          return;
        }
      }

      if (this.currentCoverIndex < this.data.length - 1) {
        if (this.covers[0].classList.contains('cover-left-2')) {
          this.removeCover(this.covers[0]);
          this.covers.shift();
        }

        const res = this.addCoverToBack(this.currentCoverIndex + 3);
        this.move(res);

        this.currentCoverIndex++;
      }

      if (this.currentCoverIndex === this.data.length - 1) {
        this.triggerEvent(EVENT.LAST_COVER);
      }

      this.updateStatus();
    }

    append(data) {
      this.data = [...this.data, ...data];

      if (this.covers.length) {
        this.next();
      } else {
        this.render(COVER_CENTER);
      }

      this.updateStatus();
    }

    trackAnimation() {
      console.log('trackAnimation', this.selectedCover);

      this.lock({overlay: false});

      this.untrack = this.untrackAnimation.bind(this);
      this.selectedCover.addEventListener('transitionend', this.untrack);
    }

    untrackAnimation(e) {
      console.log('untrackAnimation', e.target)

      this.unlock();
      e.target.removeEventListener('transitionend', this.untrack);
    }

    move(offset = 0) {
      this.trackAnimation();

      this.covers.forEach((item, index) => {
        item.className = `cover ${coverClasses[index + offset]}`
      });
    }

    updateStatus() {
      if (this.showStatus && this.data.length) {
        this.counterCurrent.dataset.current = this.currentCoverIndex + 1;
        this.counterTotal.dataset.total = this.data.length;
      }

      this.triggerEvent(EVENT.STATUS_UPDATE, {
        current: this.currentCoverIndex + 1,
        total: this.data.length
      })
    }

    lock(params = {overlay: true}) {
      console.log('LOCK');
      this.unbindControls();
      params.overlay && this.el.classList.add('locked');
    }

    unlock() {
      console.log('UNLOCK')
      this.bindControls();
      this.el.classList.remove('locked');
    }

    render(classOffset = 0) {
      let size = this.data.length < 3 ? this.data.length : 3;

      for (let i = 0, offset = classOffset; i < size; i++) {
        this.addCoverToBack(i, offset++);
      }
      this.currentCoverIndex = 2 - classOffset;
    }
  };

  const progressbar = new Progressbar({
    el: '.progressbar'
  });

  const landing = new Landing();

  const coverflow = new Coverflow({
    el: '#coverflow',
    template: `<img src="{{content}}" />`,
    data: [],
    //displayField: 'src',
    displayField: 'cover',
    mirrors: true,
    showStatus: true,

    hit: (ctx) => {
      ctx.lock({overlay: false});
      landing
        .show(ctx.selectedItem.poster_path)
        .then(() => ctx.unlock()
      );
    }
  });

  coverflow
    .on('hit', function(e) {
      console.log('hit', e);
      this.lock({overlay: false});
      landing.show(e.cover).then(() =>
        this.unlock()
      );
    })
    .on('dataRequest', function(e) {
      console.log('DATA_REQUEST')

      this.lock();

      dataset.load().then(res => {
        res[0]
          ?this.append(res)
          :this.unlock();
      });
    })
    .on('firstCover', function() {
      console.log('firstCover')
    })
    .on('lastCover', function() {
      console.log('lastCover')
    })
    .on('statusUpdate', function(e) {
      //console.log('statusUpdate', e)
      //progressbar.value = Math.round(100 * e.current / e.total);
    })
    .on('coverChange', function(e) {
      console.log('coverChange')
      //landing.show(e.poster_path);
    })

  coverflow.lock();
  dataset.load().then(res => {
    coverflow.append(res);
    coverflow.unlock();
  });

  //console.log(coverflow.events)
})()