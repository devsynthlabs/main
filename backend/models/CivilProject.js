import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    id: String,
    name: String,
    duration: Number,
    dependencies: [String],
    es: Number,
    ef: Number,
    ls: Number,
    lf: Number,
    slack: Number,
    critical: Boolean
});

const civilProjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    status: {
        type: String,
        default: 'Planning'
    },
    tasks: [taskSchema],
    criticalPath: [String],
    totalDuration: {
        type: Number
    }
}, { timestamps: true });

const CivilProject = mongoose.model('CivilProject', civilProjectSchema);

export default CivilProject;
