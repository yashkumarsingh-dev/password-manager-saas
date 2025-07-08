import { useState } from "react";
import { Button } from "../components/ui/button";

export default function Profile() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile & Settings</h1>
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowChangePassword((v) => !v)}>
          {showChangePassword ? "Hide" : "Change Password"}
        </Button>
        {showChangePassword && (
          <div className="border rounded p-4 mt-2 bg-gray-50">
            <div className="mb-2 font-semibold">
              Change Password (placeholder)
            </div>
            {/* TODO: Add change password form */}
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <Button>Update Password</Button>
          </div>
        )}
        <Button variant="outline" onClick={() => setShow2FA((v) => !v)}>
          {show2FA ? "Hide" : "Manage 2FA"}
        </Button>
        {show2FA && (
          <div className="border rounded p-4 mt-2 bg-gray-50">
            <div className="mb-2 font-semibold">Manage 2FA (placeholder)</div>
            {/* TODO: Add 2FA management (show QR, enable/disable, etc.) */}
            <Button>Reset 2FA</Button>
          </div>
        )}
      </div>
    </div>
  );
}
