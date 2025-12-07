router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ success: false, mess: "No refresh token" });

  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json({ success: false, mess: "Invalid refresh token" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, mess: "Expired refresh token" });

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      success: true,
      accessToken: newAccessToken,
    });
  });
});
