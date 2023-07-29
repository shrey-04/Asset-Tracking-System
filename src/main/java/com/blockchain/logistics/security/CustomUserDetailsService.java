package com.blockchain.logistics.security;

import com.blockchain.logistics.persistence.entity.Users;
import com.blockchain.logistics.persistence.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        log.info("Trying to retrieving user: {}", userName);
        Optional<Users> user = userRepository.findByEmail(userName);

        if (user.isPresent()) {
            return new CustomUserDetails(user.get(), null, null);
        } else {
            throw new UsernameNotFoundException("No user found with the name " + userName);
        }
    }
}
