import React, { useState } from "react";
import { createBloodCamp } from "../services/api";
// TODO: Create sampleBloodCamps utility or remove if not needed
// import { sampleBloodCamps } from "../utils/sampleData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createSampleCamps = async () => {
    setIsCreating(true);
    try {
      // Sample blood camp data
      const sampleBloodCamps = [
        {
          campName: "Community Blood Drive - January",
          campDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          campTime: "10:00 AM - 4:00 PM",
          location: "City Hospital, Main Hall",
          state: "Maharashtra",
          district: "Mumbai",
          organizer: "Red Cross Society",
          description: "Monthly community blood drive. All blood types welcome.",
          contactPhone: "+91-9876543210",
          contactEmail: "bloodcamp@redcross.org"
        }
      ];
      
      let successCount = 0;
      for (const camp of sampleBloodCamps) {
        try {
          await createBloodCamp(camp);
          successCount++;
        } catch (error) {
          console.error("Error creating camp:", error);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} blood camp(s)!`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error('Failed to create blood camps. Please check your connection and try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error creating sample camps:", error);
      toast.error('Error creating sample camps. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] bg-gray-100 py-8 px-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sample Data Management</h3>
              <p className="text-gray-600 mb-4">
                Create sample blood camps for testing the blood donation registration system.
              </p>
              
              <Button
                onClick={createSampleCamps}
                disabled={isCreating}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isCreating ? "Creating Sample Camps..." : "Create Sample Blood Camps"}
              </Button>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-2">Note:</h4>
              <p className="text-sm text-gray-600">
                Backend integration with Express/MongoDB is pending. Once connected, you'll be able to create and manage blood camps.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
