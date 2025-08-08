"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [catImageUrl, setCatImageUrl] = useState("https://cataas.com/cat");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
    } else {
      fetchComments(accessToken);
    }
  }, [router]);


  const fetchComments = async (accessToken: string) => {
    const response = await fetch("http://localhost:5127/api/Comment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return;

    const data = await response.json();
    setComments(data);
  };

  const fetchNewCat = () => {
    setCatImageUrl(`https://cataas.com/cat?${new Date().getTime()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    const accessToken = localStorage.getItem("accessToken");

    await fetch("http://localhost:5127/api/Comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        Content: comment,
      }),
    });

    fetchComments(accessToken!);

    setComment("");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <div>
      <div className="flex justify-end-safe pt-2 pr-6 pl-4">
        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="font-mono flex flex-row p-4 gap-12">
        <div className="flex flex-col space-y-4 w-full">

          <img
            src={catImageUrl}
            alt="cat"
            className="h-137 w-full rounded-lg shadow-md object-none"
          />

          <button
            onClick={fetchNewCat}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Generate new cat
          </button>
        </div>

        <div className="max-w-md w-full">
          <div className="h-110 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2 bg-gray-50 mb-4">
            {comments.length === 0 && (
              <p className="text-gray-400 italic">No comments yet.</p>
            )}
            {comments.map((cmt, index) => (
              <div
                key={index}
                className="bg-white p-2 rounded-md border border-gray-300"
              >
                <span className="text-gray-500 text-xs">
                  {cmt.createdBy}
                </span>
                <p>{cmt.content}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full space-y-4"
          >
            <textarea
              placeholder="Write a comment..."
              className="w-full border p-2 rounded-md resize-none"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}