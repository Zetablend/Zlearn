const { Courses } = require('../../models');
const { uploadBase64ToS3 } = require('../../utility/s3Uploader');
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");

exports.postCourses= async (req, res) => {
  try {
    const {adminId,title,description,Instructor_name,course_image,course_video,sales,
        topics,Price,discount,Totaltime,status,Category,subcategory,sellingtype} = req.body;
let imageUrl=null;
if(course_image){
    imageUrl = await uploadBase64ToS3(course_image, `admin_${adminId}/images`)}
let videoUrl=null;
if(course_video){
    videoUrl = await uploadBase64ToS3(course_video, `admin_${adminId}/videos`)}

    const newCourses = await Courses.create({adminId,title,description,Instructor_name,course_image:imageUrl,course_video:videoUrl,sales,
        topics,Price,discount,Totaltime,status,Category,subcategory,sellingtype});

    return res.status(201).json({
          message:"new courses details added successfully",
          data:newCourses
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deleteFromS3 = async (url) => {
  if (!url) return;
  const key = url.split(".amazonaws.com/")[1];
  if (!key) return;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (err) {
    console.warn("S3 delete failed:", err.message);
  }
};
exports.Updatecourses = async (req, res) => {
  try {
    const { id, adminId, course_image, course_video,...rest } = req.body;

    const courses = await Courses.findByPk(id);
    if (!courses) {
      return res.status(404).json({ message: 'course not found' });
    }
    if (course_image) {
      if (courses.course_image) {
        await deleteFromS3(courses.course_image);
      }
      rest.course_image = await uploadBase64ToS3(course_image, `admin_${adminId}/images`);
    }

    // Handle video update
    if (course_video) {
      if (courses.course_video) {
        await deleteFromS3(courses.course_video);
      }
      rest.course_video = await uploadBase64ToS3(course_video, `admin_${adminId}/videos`);
    }
    

    // Get all valid column names from model
    const modelFields = Object.keys(Courses.rawAttributes);

    // Keep only fields that exist in DB
    const updateData = {};
    for (const key of Object.keys(rest)) {
      if (modelFields.includes(key)&& rest[key] !== undefined) {
        updateData[key] = rest[key];
      }
    }

    await courses.update(updateData);

    res.status(200).json({
      message: 'courses details updated successfully',
      data: updateData
    });

  } catch (err) {
    console.error("Update Course Error:", err);
    res.status(500).json({ error: err.message });
  }
};
 exports.getcoursedetails=async(req,res)=>{
    try{
    const {id} = req.params;
    const courses = await Courses.findByPk(id);
    if (!courses) {
      return res.status(404).json({ message: 'course not found' });}
    
   res.status(200).json({
      message: 'courses details fetched successfully',
      data: courses
    });

    }catch (err) {
    console.error("Update Course Error:", err);
    res.status(500).json({ error: err.message });
  }
 }
exports.getCourses = async (req, res) => {
  try {
    const { title, status, id, Instructor_name, page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    const courseWhere = {};

    if (title) {
      courseWhere.title = { [Op.like]: `%${title}%` };
    }

    if (status) {
      courseWhere.status = status;
    }

    if (id) {
      courseWhere.id = id;
    }

    if (Instructor_name) {
      courseWhere.Instructor_name = { [Op.like]: `%${Instructor_name}%` };
    }

    const { count, rows } = await Courses.findAndCountAll({
      where: courseWhere,
      offset,
      limit: parsedLimit,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage: parsedPage,
      courses: rows,
    });
  } catch (err) {
    console.error("Get Courses Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getExportcourses=async(req,res)=>{
try{
     const { title, status, id, Instructor_name,format} = req.query;
     

     const courseWhere = {};

    if (title) {
      courseWhere.title = { [Op.like]: `%${title}%` };
    }

    if (status) {
      courseWhere.status = status;
    }

    if (id) {
      courseWhere.id = id;
    }

    if (Instructor_name) {
      courseWhere.Instructor_name = { [Op.like]: `%${Instructor_name}%` };
    }

    const course = await Courses.findOne({where: courseWhere});
     if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
     const jsonData = [course.toJSON()];

     if (format === "csv") {
      const fields = Object.keys(jsonData[0]);
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(jsonData);

      res.header("Content-Type", "text/csv");
      res.attachment(`course_${id}.csv`);
      return res.send(csv);
    }

    // 🔑 Excel export
    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Course");

      worksheet.columns = Object.keys(jsonData[0]).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));

      worksheet.addRows(jsonData);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=course_${id}.xlsx`);

      await workbook.xlsx.write(res);
      return res.end();
    }  

}catch (err) {
    console.error("Get Courses Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

exports.softDeleteCourses = async (req, res) => {
  try {
    const { id } = req.params;

    const courses = await Courses.findByPk(id);
    if (!courses) return res.status(404).json({ message: "course not found" });

    await courses.destroy();

    return res.status(200).json({ message: "course  deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
