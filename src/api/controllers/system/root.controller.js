class RootController {
  static getAppInfo = (req, res) => {
    res.status(200).json({
      message: "Welcome to Cvio API",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };
}

export default RootController;
