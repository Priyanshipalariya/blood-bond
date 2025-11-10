import { useAuth } from "../Context/AuthContext";

const UserProfile = () => {
  const { user, userData } = useAuth();

  if (!user || !userData) {
    return (
      <div className="p-4">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Name:</label>
          <p className="text-lg text-gray-800">{userData.fullName || userData.displayName || "Not provided"}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Email:</label>
          <p className="text-lg text-gray-800">{userData.email}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Phone:</label>
          <p className="text-lg text-gray-800">{userData.phone || "Not provided"}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Blood Type:</label>
          <p className="text-lg text-gray-800">{userData.bloodType || "Not provided"}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Date of Birth:</label>
          <p className="text-lg text-gray-800">{userData.dob || "Not provided"}</p>
        </div>
        
        {userData.createdAt && (
          <div>
            <label className="text-sm font-medium text-gray-600">Member Since:</label>
            <p className="text-lg text-gray-800">
              {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
        
        {userData.lastLoginAt && (
          <div>
            <label className="text-sm font-medium text-gray-600">Last Login:</label>
            <p className="text-lg text-gray-800">
              {new Date(userData.lastLoginAt.seconds * 1000).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

