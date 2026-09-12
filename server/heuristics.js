module.exports = {
  instagram: {
    errorMsg: [
      "sorry, this page isn't available",
      'the link you followed may be broken',
      '"page_not_found"',
    ],
  },
  twitter: {
    errorMsg: [
      "this account doesn’t exist",
      "this account doesn't exist",
      'account suspended',
    ],
    unknownStatus: [403, 429],
  },
  tiktok: {
    errorMsg: [
      "couldn't find this account",
      "couldn't find this account",
      "cannot find this account",
      "couldn't find this user",
    ],
  },
  facebook: {
    errorMsg: ['this content isn\'t available', "content isn't available right now", 'page not found'],
    unknownStatus: [403],
  },
  linkedin: {
    unknownStatus: [403, 999],
    errorMsg: ['this page doesn’t exist', "this page doesn't exist", 'page not found'],
  },
  reddit: {
    errorMsg: ['sorry, nobody on reddit goes by that name', 'page not found'],
  },
  threads: {
    errorMsg: ["sorry, this page isn't available", "this page isn't available"],
  },
  youtube: {
    errorMsg: ["this page isn't available", '404 not found', 'channel does not exist'],
  },
  twitch: {
    errorMsg: ['sorry. unless you’ve got a time machine', 'page not found'],
  },
  telegram: {
    errorMsg: ['if you have telegram, you can contact', 'tgme_page_title">telegram'],
  },
  medium: {
    errorMsg: ['out of nothing, something', 'page not found', '410'],
  },
  pinterest: {
    errorMsg: ["sorry, we couldn't find", 'user not found'],
  },
  snapchat: {
    unknownStatus: [403],
    errorMsg: ['page not found', "we couldn't find"],
  },
  discord: {
    unknownStatus: [403, 401],
  },
  whatsapp: {
    unknownStatus: [403],
  },
  steam: {
    errorMsg: ['the specified profile could not be found', 'error occurred while processing'],
  },
  npm: {
    errorMsg: ["couldn't find that user", 'user not found', 'not found'],
  },
  github: {},
  gitlab: {
    errorMsg: ['sign in or sign up', '404'],
  },
};
