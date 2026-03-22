const dayjs = require("dayjs");
const JobApplication = require("../models/JobApplication");

const listApplications = async (req, res, next) => {
  try {
    const data = await JobApplication.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const createApplication = async (req, res, next) => {
  try {
    const payload = { ...req.body, user: req.userId };
    const app = await JobApplication.create(payload);
    return res.status(201).json(app);
  } catch (error) {
    return next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const app = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json(app);
  } catch (error) {
    return next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    await JobApplication.findOneAndDelete({ _id: req.params.id, user: req.userId });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

const reminders = async (req, res, next) => {
  try {
    const waitDays = Number(req.query.days || 7);
    const threshold = dayjs().subtract(waitDays, "day").toDate();

    const stale = await JobApplication.find({
      user: req.userId,
      status: "Applied",
      appliedDate: { $lte: threshold },
    });

    return res.json({
      daysThreshold: waitDays,
      reminders: stale.map((item) => ({
        id: item._id,
        company: item.company,
        role: item.role,
        appliedDate: item.appliedDate,
        message: `Follow up with ${item.company} for ${item.role}.`,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  reminders,
};
