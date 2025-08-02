// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';
// import logger from '../utils/logger.js';
// import config from '../config/index.js';

// class UserController {
//     async register(req, res) {
//         try {
//             const { username, email, password } = req.body;
            
//             // Check if user already exists
//             const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//             if (existingUser) {
//                 return res.status(400).json({ 
//                     success: false, 
//                     message: 'User already exists with this email or username' 
//                 });
//             }
            
//             // Hash password
//             const hashedPassword = await bcrypt.hash(password, 10);
            
//             // Create user
//             const user = new User({
//                 username,
//                 email,
//                 password: hashedPassword
//             });
            
//             await user.save();
            
//             // Generate token
//             const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
            
//             res.status(201).json({
//                 success: true,
//                 message: 'User registered successfully',
//                 token,
//                 user: {
//                     id: user._id,
//                     username: user.username,
//                     email: user.email
//                 }
//             });
//         } catch (error) {
//             logger.error('Registration error:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async login(req, res) {
//         try {
//             const { email, password } = req.body;
            
//             // Find user
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(401).json({ success: false, message: 'Invalid credentials' });
//             }
            
//             // Check password
//             const isPasswordValid = await bcrypt.compare(password, user.password);
//             if (!isPasswordValid) {
//                 return res.status(401).json({ success: false, message: 'Invalid credentials' });
//             }
            
//             // Generate token
//             const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
            
//             res.status(200).json({
//                 success: true,
//                 message: 'Login successful',
//                 token,
//                 user: {
//                     id: user._id,
//                     username: user.username,
//                     email: user.email
//                 }
//             });
//         } catch (error) {
//             logger.error('Login error:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async getProfile(req, res) {
//         try {
//             const user = await User.findById(req.user.id).select('-password');
//             if (!user) {
//                 return res.status(404).json({ success: false, message: 'User not found' });
//             }
            
//             res.status(200).json({ success: true, data: user });
//         } catch (error) {
//             logger.error('Get profile error:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async updateProfile(req, res) {
//         try {
//             const { username, email } = req.body;
//             const user = await User.findByIdAndUpdate(
//                 req.user.id,
//                 { username, email },
//                 { new: true, runValidators: true }
//             ).select('-password');
            
//             if (!user) {
//                 return res.status(404).json({ success: false, message: 'User not found' });
//             }
            
//             res.status(200).json({ success: true, data: user });
//         } catch (error) {
//             logger.error('Update profile error:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }

//     async deleteProfile(req, res) {
//         try {
//             await User.findByIdAndDelete(req.user.id);
//             res.status(200).json({ success: true, message: 'Profile deleted successfully' });
//         } catch (error) {
//             logger.error('Delete profile error:', error);
//             res.status(500).json({ success: false, message: 'Internal server error' });
//         }
//     }
// }

// export default new UserController();
