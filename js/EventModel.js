class EventModel {
  on(name, fn) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(fn);

    return this;
  }

  triggerEvent(name, e) {
    if (this.events[name] && this.events[name].length) {
      this.events[name].forEach(fn => fn.call(this, e));
      return true;
    }

    return false;
  }
}