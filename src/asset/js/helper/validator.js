import $ from './z';

let Validator = {
  config: (toast) => {
    Validator.toast = toast;
  },

  empty: (s) => {
    s = $.trim(s);

    return s === '';
  },

  required: (s) => {
    s = $.trim(s);

    return s !== '';
  },

  len: (s, size) => {
    s = $.trim(s);

    return s.length === size;
  },

  licenseplate: (s) => {
    s = $.trim(s);
    let re = /^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$/;

    return re.test(s);
  },

  test: (rule, msg, ...args) => {
    let r = Validator[rule].apply(Validator, args);

    if (!Validator.toast) {
      throw Error('Validator 没有配置 toast 参数');
    }

    if (!r) {
      Validator.toast.warn(msg);
    }

    return r;
  }
};

export default Validator;
