abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = async (req, res) => {
    try {
      const docs = await this.model.find({});
      res.json(docs);
    } catch (err) { console.error(err); }
  };

  // Count all
  count = async (req, res) => {
    try {
      const count = await this.model.countDocuments();
      res.json(count);
    } catch (err) { console.error(err); }
  };

  // Insert
  insert = async (req, res) => {
    try {
      const obj = new this.model(req.body);
      this.insertProcess(obj);
      const item = await obj.save();
      res.status(200).json(item);
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(400).json({});
      } else {
        console.error(err);
      }
    }
  };

  insertProcess(obj: any) {
    console.log('base insertProcess');
  }

  // Get by id
  get = async (req, res) => {
    try {
      const obj = await this.model.findOne({ _id: req.params.id });
      res.json(obj);
    } catch (err) { console.error(err); }
  };

  // Update by id
  update = async (req, res) => {
    try {
      this.updateProcess(req.body);
      await this.model.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.status(200).json({});
    } catch (err) { console.error(err); }
  };

  updateProcess(body: any) {
    console.log('base updateProcess');
  }

  // Delete by id
  delete = async (req, res) => {
    const shouldDelete = await this.deleteProcess(req, res);
    if (shouldDelete) {
      try {
        await this.model.findOneAndDelete({ _id: req.params.id });
        res.status(200).json({});
      } catch (err) { console.error(err); }
    }
  };

  deleteProcess(req, res): any {
    console.log('base deleteProcess');
    return true;
  }
}

export default BaseCtrl;
