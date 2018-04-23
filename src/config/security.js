function JWTConfig() {
  function getJWTKey() {
    return 'my_secret_key';
  }

  function getJWTOptions() {
    return {
      expiresIn: 60 * 60
    };
  }

  return {
    getJWTKey,
    getJWTOptions
  }
}

module.exports = JWTConfig;