import React, { useState } from 'react';

const LikeButton: React.FC<{ conversationId: string, userId: string }> = ({ conversationId, userId }) => {
  const [usedDailyLike, setUsedDailyLike] = useState(false);

  const sendLike = () => {
    if (usedDailyLike) return;

    fetch(`/api/like`, {
      method: "POST",
      body: JSON.stringify({ conversationId, userId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          setUsedDailyLike(true);
          alert("You’ve used your daily like!"); // Replace with better UI in production
        }
      })
      .catch((err) => console.error("Error sending like:", err));
  };

  return (
    <div id="like-section">
      <button id="send-like" onClick={sendLike} disabled={usedDailyLike}>❤️ Send Like</button>
    </div>
  );
};

export default LikeButton;