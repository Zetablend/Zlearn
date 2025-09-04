module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Userqueryinfo", {
    // 1. Basic Information
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    age_range: {
      type: DataTypes.ENUM("Under 18", "18–24", "25–30", "31–40", "40+"),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
     status:{
      type:DataTypes.ENUM('pending','registered','not interested'),
      allowNull: false,
       defaultValue: 'pending',
    },

    // 2. Type of Support Needed (up to 2)
    support_type: {
      type: DataTypes.JSON,
    },

    // 3. Current Situation
    current_situation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 4. Field or Industry of Interest
    interest_field: {
      type: DataTypes.JSON,
    },

    // 5. Preferred Mentor Traits
    preferred_gender: {
      type: DataTypes.ENUM("Female", "Male", "No preference"),
    },
    preferred_style: {
      type: DataTypes.STRING,
    },
    preferred_mode: {
      type: DataTypes.STRING,
    },

    // 7. Final Notes
    final_note: {
      type: DataTypes.TEXT,
    },

    // 8. Consent
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    match_understood: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },{
    tableName: 'Userqueryinfos',
    timestamps: true
  });
};
