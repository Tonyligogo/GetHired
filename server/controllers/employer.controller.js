import Employer from "../models/employer.model.js";

export const getEmployerData = async (req, res) => {
    const { id } = req.params;
  
    try {
      const employer = await Employer.findOne({user: id})
      .populate({ path: "user", options: { strictPopulate: false } })
      .populate({ 
        path: "postedJobs",
        options: { strictPopulate: false },
        populate: { path: "applicants" } 
      })
      .exec()

      if(!employer){
        return res.status(401).json({msg:"No such employer found!"});
        // employer = new Employer({user: employerId})
      }

      res.json(employer);
    } catch (error) {
      console.error('Error fetching employer details:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };