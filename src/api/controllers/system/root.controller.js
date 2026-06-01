class RootController {
  static getAppInfo = (req, res) => {
    res
      .status(200)
      .json({
        message: "Welcome to Agnon API",
        timestamp: new Date().toISOString(),
      });
  };
}

export default RootController;
