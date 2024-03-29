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
      this.coverElements = this.el.querySelector('.cover-elements');
      this.frame = this.el.querySelector('.cover-frame');
      this.counterCurrent  = this.el.querySelector('.cover-frame__left-bottom');
      this.counterTotal = this.el.querySelector('.cover-frame__right-bottom');
      this.arrowLeft = this.el.querySelector('.nav-arrow__left');
      this.arrowRight = this.el.querySelector('.nav-arrow__right');

      // Params properties
      this.data = params.data || [];
      this.displayField = params.displayField || null;
      this.template = params.template || `<div>{{content}}</div>`;

      // Component internal properties
      this.covers = [];
      this.currentCoverIndex = 0;
      this.limit = 5;
      this.events = {};
      this.elementAbsoluteXCenter = this.el.getBoundingClientRect().left + (this.el.offsetWidth >> 1);

      //
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onClick = this.onClick.bind(this);

      //
      this.render(COVER_CENTER); // class offset index
      this.bindControls();
      this.updateStatus();
    }

    get selectedCover() {
      return this.covers[COVER_CENTER];
    }

    bindControls() {
      window.addEventListener('keydown', this.onKeyDown);
      this.el.addEventListener('click', this.onClick);
    }

    unbindControls() {
      window.removeEventListener('keydown', this.onKeyDown);
      this.el.removeEventListener('click', this.onClick);
    }

    onKeyDown(e) {
      //e.code === 'Enter' && this.triggerEvent(EVENT.HIT, this.data[this.currentCoverIndex]);
      e.code === 'Enter' && this.params.hit && this.triggerEvent(EVENT.HIT, this.data[this.currentCoverIndex]);//this.params.hit(this);
      e.code === 'ArrowLeft' && this.prev();
      e.code === 'ArrowRight' && this.next();
    }

    onClick(e) {
      if (e.target === this.frame) {
        return this.triggerEvent(EVENT.HIT, this.data[this.currentCoverIndex]);
      }
      e.clientX < this.elementAbsoluteXCenter ? this.prev():this.next();
    }

    createCover(nextInsertItemIndex = 0, index = 0) {
      let content = this.displayField ?
        this.data[nextInsertItemIndex][this.displayField]:
        this.data[nextInsertItemIndex];

      let $cover = document.createElement('li');
        $cover.className = `cover ${coverClasses[index]}`;

      let $coverContent = document.createElement('div');
        $coverContent.className = 'cover-content';
        $coverContent.innerHTML = this.template.replace(`{{content}}`, content);

      $cover.appendChild($coverContent);

      if (!!this.params.mirrors) {
        let $mirror = $coverContent.cloneNode(true);
          $mirror.classList.add('mirror');

        let $fader = document.createElement('div');
          $fader.className = 'fader';

        $cover.appendChild($mirror);
        $cover.appendChild($fader);
      }

      return $cover;
    }

    removeCover(cover) {
      cover.parentNode.removeChild(cover);
    }

    addCoverToFront(nextInsertItemIndex = 0, coverIndex = 0) {
      if (this.data[nextInsertItemIndex]) {

        const $cover = this.createCover(nextInsertItemIndex, coverIndex);

        this.covers.unshift($cover);
        this.coverElements.insertBefore($cover, this.coverElements.children[0]);

        return 0;
      }

      // if no image was added to the left
      return 3 - this.currentCoverIndex;
    }

    addCoverToBack(nextInsertItemIndex = 0, coverIndex = 4) {
      if (this.data[nextInsertItemIndex]) {

        const $cover = this.createCover(nextInsertItemIndex, coverIndex);

        this.covers.push($cover);
        this.coverElements.appendChild($cover);

        return this.limit - this.covers.length;
      }

      // if no image was added to the right
      return 1 - this.currentCoverIndex > 0 ? 1:0;
    }

    prev() {
      if (this.currentCoverIndex > 0) {
        if (this.covers.at(-1).classList.contains('cover-right-2')) {
          this.removeCover(this.covers.at(-1));
          this.covers.pop();
        }
        const res = this.addCoverToFront(this.currentCoverIndex - 3);
        this.move(res);

        this.currentCoverIndex--;
      }

      !this.currentCoverIndex &&
        this.triggerEvent(EVENT.FIRST_COVER);
      
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

      this.covers.length
        ? this.next()
        : this.render(COVER_CENTER);

      this.updateStatus();
    }

    trackAnimation() {
      this.lock({overlay: false});
      this.untrack = this.untrackAnimation.bind(this);
      this.selectedCover.addEventListener('transitionend', this.untrack);
    }

    untrackAnimation(e) {
      this.unlock();
      e.target.removeEventListener('transitionend', this.untrack);
    }

    move(offset = 0) {
      this.trackAnimation();

      this.covers.forEach((item, index) => {
        item.className = `cover ${coverClasses[index + offset]}`;
      });
    }

    updateStatus() {
      if (!!this.params.showStatus && this.data.length) {
        this.counterCurrent.dataset.current = this.currentCoverIndex + 1;
        this.counterTotal.dataset.total = this.data.length;
      }

      this.triggerEvent(EVENT.STATUS_UPDATE, {
        current: this.currentCoverIndex + 1,
        total: this.data.length
      })
    }

    lock(params = {overlay: true}) {
      this.unbindControls();
      params.overlay && this.el.classList.add('is-locked');
    }

    unlock() {
      this.bindControls();
      this.el.classList.remove('is-locked');
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
    data: images3,
    //displayField: 'src',
    // displayField: 'cover',
    mirrors: true,
    showStatus: true,

    /*
    hit: (ctx) => {
      ctx.lock({overlay: true});
      landing
        .show(ctx.selectedItem.poster_path)
        .then(() => ctx.unlock()
      );
    }
    */
  });

  coverflow
    /*
    .on('hit', function(e) {
      console.log('hit', e);
      this.lock({overlay: false});
      landing.show(e).then(() =>
        this.unlock()
      );
    })
    */
    /*
    .on('dataRequest', function(e) {
      console.log('DATA_REQUEST')

      this.lock();

      dataset.load().then(res => {
        res[0]
          ?this.append(res)
          :this.unlock();
      });
    })
    */
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

  /*
  coverflow.lock();
  dataset.load().then(res => {
    coverflow.append(res);
    coverflow.unlock();
  });
  */


  //console.log(coverflow.events)
})()