package com.blockchain.logistics.interceptors;

import com.blockchain.logistics.lib.constant.Token;
import com.blockchain.logistics.lib.utils.JwtUtils;
import com.blockchain.logistics.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            var authorizationHeader = request.getHeader("Authorization");

            if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith(Token.BEARER)) {
                log.info("Token exist in the header. Beginning token validation");

                String token = authorizationHeader.substring(7);
                String userId = jwtUtils.extractUserId(token);

                if (StringUtils.hasText(userId) && Boolean.TRUE.equals(jwtUtils.validateToken(token))) {
                    log.info("Token valid. Trying to find the user with id: {} from the token", userId);
                    var userDetails = userDetailsService.loadUserByUsername(userId);

                    var userNameAndPasswordAuthToken =
                            new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());

                    userNameAndPasswordAuthToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(userNameAndPasswordAuthToken);

                    log.info("User authenticated successfully");
                }
            }
        } catch (Exception e) {
            log.error("Could not set user authentication in security context {}", e.getMessage());
            log.debug("Could not set user authentication in security context ", e.getStackTrace());
        }

        filterChain.doFilter(request, response);
    }
}
